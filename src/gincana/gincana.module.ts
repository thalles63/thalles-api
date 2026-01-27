import { Module } from "@nestjs/common";
import { InscricaoModule } from "./modules/inscricao/inscricao.module";
import { PagamentoModule } from "./modules/pagamento/pagamento.module";
import { ParticipanteModule } from "./modules/participante/participante.module";

@Module({
    imports: [InscricaoModule, ParticipanteModule, PagamentoModule]
})
export class GincanaModule {}
