import app from "./src/app";
import { config } from "./src/config/app.config";
import logger from "./src/utils/logger/logger";

const PORT = config.server.port;

app.listen(PORT, () => {
    if (config.server.env === "PRD") {
        logger.info(`Server running at http://localhost:${PORT}`);
        logger.info(`Environment: ${config.server.env}`);
    }
});

// // const express = require("express");
// const {
//   exchangeNpssoForAccessCode,
//   exchangeAccessCodeForAuthTokens,
// } = require("psn-api");
// // const app = express();

// async function teste() {
//   const myNpsso =
//     "dqYJVKd0Ng8YPAPCEvPGxtoiz1KGh9O76zC62S7DTAC2yS309RSHaeNVRLAXL87W";
//   const accessCode = await exchangeNpssoForAccessCode(myNpsso);
//   const authorization = await exchangeAccessCodeForAuthTokens(accessCode);

//   console.log(authorization);
// }

// teste();
// // app.get('/api/psn/trophies/:titleId', async (req, res) => {
// //   try {

// //     // // Autentica e obtém access token (cachê-lo em produção)
// //     // const { code, access_token } = await authenticate({ npSSO: 'SEU_NPSSO' });
// //     // // Obtem troféus conquistados para o título especificado
// //     // const data = await getUserTrophiesEarnedForTitle(
// //     //   { accessToken: access_token },
// //     //   'me',
// //     //   req.params.titleId,
// //     //   'all'
// //     // );
// //     // res.json(data);
// //   } catch(err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });
