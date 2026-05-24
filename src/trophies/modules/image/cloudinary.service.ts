import { Injectable, Logger } from "@nestjs/common";
import { v2 as cloudinary } from "cloudinary";
import { TrophiesConfig } from "../../infrastructure/config/app.config";

const CLOUDINARY_DOMAIN = "res.cloudinary.com";

const BROWSER_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    // image/avif removido intencionalmente: CDNs como o IGDB servem AVIF para imagens grandes
    // (ex.: t_1080p_2x), e o SDK do Cloudinary não assina corretamente buffers AVIF,
    // gerando "Upload preset must be specified when using unsigned upload".
    Accept: "image/webp,image/apng,image/*,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "sec-fetch-dest": "image",
    "sec-fetch-mode": "no-cors",
    "sec-fetch-site": "same-site",
    Connection: "keep-alive"
};

const REFERER_MAP: Record<string, string> = {
    "psnprofiles.com": "https://psnprofiles.com/",
    "retroachievements.org": "https://retroachievements.org/"
};

@Injectable()
export class CloudinaryService {
    private readonly logger = new Logger(CloudinaryService.name);
    private readonly env: string;

    constructor() {
        this.env = TrophiesConfig.nodeEnv === "PRD" ? "trophies-prd" : "trophies-dev";

        const { cloudName, apiKey, apiSecret } = TrophiesConfig.cloudinary;

        if (!cloudName || !apiKey || !apiSecret) {
            this.logger.error(
                `Cloudinary credentials incompletas — ` +
                `cloud_name:${!!cloudName} api_key:${!!apiKey} api_secret:${!!apiSecret}`
            );
        }

        cloudinary.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret
        });
    }

    public isCloudinaryUrl(url: string | null | undefined): boolean {
        return !!url && url.includes(CLOUDINARY_DOMAIN);
    }

    public gamePublicId(gameId: string, key: string): string {
        return `${this.env}/${gameId}/${key}`;
    }

    public achievementPublicId(gameId: string, achievementId: string): string {
        return `${this.env}/${gameId}/achievements/${achievementId}`;
    }

    public async uploadFromUrl(url: string, publicId: string): Promise<string> {
        const buffer = await this.fetchImageBuffer(url);
        return this.uploadBuffer(buffer, publicId);
    }

    private async uploadBuffer(buffer: Buffer, publicId: string): Promise<string> {
        // upload_stream falha em assinar corretamente requisições grandes quando há um
        // preset padrão configurado na conta — o Cloudinary recebe a requisição como
        // não autenticada e exige um preset explícito.
        // Solução: upload() com data URI assina tudo antes de transmitir o payload,
        // eliminando o problema independente do tamanho do arquivo.
        const dataUri = `data:application/octet-stream;base64,${buffer.toString("base64")}`;
        const result = await cloudinary.uploader.upload(dataUri, {
            public_id: publicId,
            overwrite: true,
            invalidate: true
        });
        return result.secure_url;
    }

    private async fetchImageBuffer(url: string): Promise<Buffer> {
        const referer = this.resolveReferer(url);

        const response = await fetch(url, {
            headers: { ...BROWSER_HEADERS, Referer: referer }
        });

        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
        }

        const contentType = response.headers.get("content-type") ?? "unknown";
        const buffer = Buffer.from(await response.arrayBuffer());
        const sizeMb = (buffer.length / 1024 / 1024).toFixed(2);

        this.logger.debug(`Download OK — ${contentType} — ${sizeMb}MB — ${url}`);

        if (!contentType.startsWith("image/")) {
            this.logger.warn(`Content-Type inesperado (${contentType}) para URL: ${url}`);
        }

        return buffer;
    }

    private resolveReferer(url: string): string {
        const hostname = new URL(url).hostname;
        const match = Object.keys(REFERER_MAP).find((domain) => hostname.endsWith(domain));
        return match ? REFERER_MAP[match] : new URL(url).origin + "/";
    }
}
