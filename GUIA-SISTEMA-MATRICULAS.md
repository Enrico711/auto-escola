# 🎓 Sistema de Matrículas — Guia de Configuração

O site agora tem 3 áreas novas:

| Área | Endereço | Quem usa |
|---|---|---|
| **Painel de gestão** | `seusite.vercel.app/admin` | Gestores (com senha) |
| **Acompanhar matrícula** | `seusite.vercel.app/acompanhar` | Alunos (com código) |
| Site normal | `seusite.vercel.app` | Todo mundo |

## Como funciona

1. O gestor entra em `/admin` com a senha
2. Cadastra o aluno (nome, CPF, telefone, endereço, categoria)
3. O sistema gera um **código único** (ex: `SDI-A1B2C3`) — o gestor passa esse código pro aluno
4. O gestor pode **enviar fotos dos documentos** (identidade, comprovante de residência etc) que ficam salvas em segurança
5. Conforme o processo avança, o gestor **clica na fase atual** para atualizar
6. O aluno entra em `/acompanhar`, digita o código e **vê a linha do tempo do processo dele**

As 8 fases (em ordem): Requerimento → Curso teórico → Coleta da foto e digitais → Exames médico e psicológico → Exame teórico → Curso prático → Exame prático → Emissão da CNH

---

# ⚙️ CONFIGURAÇÃO (só precisa fazer 1 vez, ~10 minutos)

O sistema precisa de um banco de dados para guardar as matrículas. Vamos usar o **Supabase** (gratuito).

## Passo 1: Criar conta no Supabase

1. Acessa: https://supabase.com
2. Clica em **"Start your project"** e cria conta (pode usar o GitHub)
3. Clica em **"New project"**
4. Nome do projeto: `auto-escola`
5. Em **Database Password**, cria uma senha qualquer e **guarda ela**
6. Region: escolhe **South America (São Paulo)**
7. Clica **"Create new project"** e aguarda ~2 minutos

## Passo 2: Criar as tabelas

1. No menu lateral do Supabase, clica em **"SQL Editor"**
2. Abre o arquivo **`supabase-setup.sql`** (está na pasta do projeto)
3. Copia TODO o conteúdo dele
4. Cola no SQL Editor e clica em **"Run"**
5. Deve aparecer "Success. No rows returned" ✅

## Passo 3: Pegar as chaves

1. No menu lateral, clica em **"Project Settings"** (engrenagem)
2. Clica em **"API"**
3. Você vai ver duas coisas que precisamos:
   - **Project URL** (algo como `https://abcdefg.supabase.co`)
   - **service_role key** (em "Project API keys" — clica em "Reveal" para ver)
4. Deixa essa aba aberta

⚠️ A `service_role` key é secreta — nunca coloca ela em nenhum arquivo do site, só no Vercel (passo 4).

## Passo 4: Configurar no Vercel

1. Acessa: https://vercel.com/dashboard
2. Clica no seu projeto
3. Clica em **"Settings"** → **"Environment Variables"**
4. Adiciona estas 3 variáveis (uma por vez):

| Name | Value |
|---|---|
| `SUPABASE_URL` | a Project URL do passo 3 |
| `SUPABASE_SERVICE_ROLE_KEY` | a service_role key do passo 3 |
| `ADMIN_PASSWORD` | a senha que os gestores vão usar pra entrar no painel (você escolhe) |

5. Clica **"Save"** em cada uma

## Passo 5: Subir o código novo e re-deploy

1. Sobe os arquivos novos no GitHub (mesmo processo de sempre)
2. O Vercel recompila sozinho
3. **Importante:** como você adicionou variáveis DEPOIS, se o deploy já tiver rodado antes de você salvar as variáveis, vai em **Deployments** → nos três pontinhos do último deploy → **"Redeploy"**

## Passo 6: Testar

1. Acessa `seusite.vercel.app/admin`
2. Entra com a senha que você definiu em `ADMIN_PASSWORD`
3. Cadastra um aluno de teste
4. Copia o código gerado (ex: `SDI-X7K2P9`)
5. Acessa `seusite.vercel.app/acompanhar` e digita o código
6. Deve aparecer a linha do tempo ✅

---

# 🔐 Segurança e privacidade (importante pra apresentação)

- A senha do painel nunca fica no código — só no Vercel
- Os documentos ficam num **bucket privado** — só quem está logado no painel consegue ver (links temporários de 1 hora)
- A consulta pública por código **só mostra o primeiro nome e a fase** — nunca CPF, endereço ou documentos
- O código de acompanhamento tem 6 caracteres aleatórios — difícil de adivinhar

**Dica LGPD para falar com a auto escola:** como o sistema guarda CPF e documentos, vale combinar com eles de coletar o consentimento do aluno na matrícula (uma linha no contrato resolve) e excluir matrículas antigas quando não forem mais necessárias (o botão de excluir já apaga tudo, documentos incluídos).

---

# ❓ Problemas comuns

**"SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY não configurados"**
→ As variáveis não foram salvas no Vercel, ou faltou fazer Redeploy depois de salvar.

**"Senha incorreta" mesmo com a senha certa**
→ Confere se não tem espaço extra no valor de `ADMIN_PASSWORD` no Vercel.

**Upload de documento falha**
→ Arquivo maior que 4MB. Tira a foto em qualidade normal ou comprime antes.
