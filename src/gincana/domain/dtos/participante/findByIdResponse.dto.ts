export interface ParticipanteFindByIdResponseDto {
    cpf: string;
    dataNascimento: Date;
    email?: string;
    nome: string;
    telefone: string;
    tamanhoCamiseta?: number;
    valor?: number;
    valorPix?: number;
}
