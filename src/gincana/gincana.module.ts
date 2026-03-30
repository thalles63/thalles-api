import { Module } from "@nestjs/common";
import { CupomModule } from "./modules/cupom/cupom.module";
import { InscricaoModule } from "./modules/inscricao/inscricao.module";
import { PagamentoModule } from "./modules/pagamento/pagamento.module";
import { ParticipanteModule } from "./modules/participante/participante.module";
import { AuthModule } from "./modules/auth/auth.module";
import { AdminModule } from "./modules/admin/admin.module";

@Module({
    imports: [InscricaoModule, ParticipanteModule, PagamentoModule, CupomModule, AuthModule, AdminModule]
})
export class GincanaModule {}
