import { GincanaModule } from "./gincana.module";
import { InscricaoModule } from "./modules/inscricao/inscricao.module";
import { PagamentoModule } from "./modules/pagamento/pagamento.module";
import { ParticipanteModule } from "./modules/participante/participante.module";

export const GincanaRouting = {
    path: "api/gincana",
    module: GincanaModule,
    children: [
        {
            path: "/",
            module: InscricaoModule
        },
        {
            path: "/",
            module: ParticipanteModule
        },
        {
            path: "/",
            module: PagamentoModule
        }
    ]
};
