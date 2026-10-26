# Boilerplate — Django + Vite + Vue (estudo guiado para estagiários)

Projeto de referência da Câmara Municipal de Jataí para ensinar, na prática, como estruturar
uma aplicação web com **backend em Django** e **frontend moderno servido pelo Vite**, com
**Vue 3** pronto para ser configurado por você.

> 🎓 **Este repositório é didático.** Ele não é um projeto "pronto para produção": é o ponto de
> partida que você vai evoluir para aprender como as peças se encaixam. Leia este README com
> calma antes de sair alterando código — ele explica o que já existe, por que existe, e o que
> você vai construir a seguir.

---

## Sumário

1. [Visão geral da stack](#visão-geral-da-stack)
2. [Estrutura de pastas](#estrutura-de-pastas)
3. [Pré-requisitos](#pré-requisitos)
4. [Instalação](#instalação)
5. [Ativando o virtualenv (sem precisar digitar `poetry run` sempre)](#ativando-o-virtualenv-sem-precisar-digitar-poetry-run-sempre)
6. [Rodando o projeto em desenvolvimento](#rodando-o-projeto-em-desenvolvimento)
7. [Como o Django conversa com o Vite](#como-o-django-conversa-com-o-vite)
8. [O código do backend em detalhes](#o-código-do-backend-em-detalhes)
9. [Build de produção](#build-de-produção)
10. [Qualidade de código (lint e format)](#qualidade-de-código-lint-e-format)
11. [O estado atual do Vue — e o seu exercício](#o-estado-atual-do-vue--e-o-seu-exercício)
12. [Problemas comuns (troubleshooting)](#problemas-comuns-troubleshooting)
13. [Licença](#licença)

---

## Visão geral da stack

| Camada            | Tecnologia                                              |
|-------------------|----------------------------------------------------------|
| Backend            | [Django](https://www.djangoproject.com/) 6.x (Python 3.12+) |
| Gerenciador Python | [Poetry](https://python-poetry.org/)                     |
| Bundler frontend   | [Vite](https://vitejs.dev/)                               |
| Integração Django ↔ Vite | [django-vite](https://github.com/MrBin99/django-vite) |
| Framework JS reativo (a configurar) | [Vue 3](https://vuejs.org/)              |
| Roteamento SPA (a configurar) | [vue-router](https://router.vuejs.org/)        |
| Estado global (a configurar) | [Pinia](https://pinia.vuejs.org/)              |
| Libs auxiliares   | `axios`, `jquery`, `lodash`, `sass`                        |
| Lint/Format JS    | ESLint (`eslint-plugin-vue`) + Prettier                    |

A ideia central do boilerplate é: **o Django continua sendo o dono das rotas, templates e
sessão**, mas os assets estáticos (JS/CSS) são compilados pelo Vite. Em desenvolvimento, o
Django serve o HTML e o Vite serve os assets com *Hot Module Replacement* (HMR); em produção,
o Vite gera um `manifest.json` que o `django-vite` lê para injetar os arquivos finais no
template.

---

## Estrutura de pastas

```
boilerplate/
├── manage.py                  # Ponto de entrada de comandos do Django
├── pyproject.toml             # Dependências Python (gerenciadas pelo Poetry)
├── package.json               # Dependências JS (gerenciadas pelo npm)
├── vite.config.js             # Configuração do Vite (entrada, alias, build, dev server)
├── eslint.config.js           # Regras de lint para JS/Vue
├── .prettierrc.json           # Regras de formatação
│
├── boilerplate/                # Projeto Django (settings, urls, wsgi/asgi)
│   ├── settings.py
│   ├── urls.py
│   └── core/                   # App Django de exemplo ("core")
│       ├── views.py
│       ├── urls.py
│       └── models.py
│
├── _templates/                 # Templates Django (HTML)
│   ├── base.html                # Template raiz: carrega o Vite e expõe a div #bp-app
│   └── core/
│       └── index.html           # Página inicial, estende base.html
│
└── _frontend/                   # Tudo que é frontend (Vite)
    ├── dist/                     # Gerado pelo build (NÃO versionar)
    └── src/
        ├── main.js                # Ponto de entrada do bundle JS
        ├── js/
        │   └── index.js            # Exemplo de script usando jQuery + axios
        └── scss/
            └── styles.scss          # Estilos globais
```

> Os prefixos `_` em `_frontend/` e `_templates/` são só uma convenção para deixá-los no topo
> da listagem de arquivos, longe das pastas padrão do Django.

---

## Pré-requisitos

Instale antes de começar:

- **Python 3.12+**
- **[Poetry](https://python-poetry.org/docs/#installation)** (gerenciador de dependências Python)
- **Node.js 20+** e **npm** (vem junto com o Node)
- Git

Verifique as versões:

```bash
python3 --version
poetry --version
node --version
npm --version
```

---

## Instalação

### 1. Clone o repositório

```bash
git clone git@github.com:cmjatai/boilerplate.git
cd boilerplate
```

### 2. Instale as dependências Python (backend)

```bash
poetry install
```

Isso cria um ambiente virtual isolado e instala Django, django-vite, etc. Para rodar qualquer
comando Python dentro desse ambiente, use `poetry run <comando>` (é o que usamos em todo este
README) — ou ative o ambiente com `poetry env activate`.

### 3. Rode as migrações e crie um superusuário (opcional)

```bash
poetry run python manage.py migrate
poetry run python manage.py createsuperuser
```

### 4. Instale as dependências JavaScript (frontend)

```bash
npm install
```

Isso instala Vite, Vue, vue-router, Pinia, axios, jQuery, lodash, ESLint, Prettier etc.,
conforme declarado em [package.json](/home/leandrojatai/desenvolvimento/envs/boilerplate/package.json).

---

## Ativando o virtualenv (sem precisar digitar `poetry run` sempre)

Todo comando Python deste README está escrito como `poetry run python manage.py ...`. O prefixo
`poetry run` existe porque o Poetry instala as dependências em um **ambiente virtual isolado**,
separado do Python do seu sistema — e `poetry run <comando>` executa aquele comando *dentro*
desse ambiente, só para aquela chamada.

Se preferir não digitar `poetry run` toda hora, você pode **ativar o ambiente virtual na sua
sessão de terminal**. Depois de ativado, basta usar `python manage.py ...` diretamente (sem o
prefixo) enquanto aquele terminal estiver aberto.

> Isso é só conveniência de terminal — não muda nada no projeto nem precisa ser commitado.

### Opção 1 — `poetry env activate` (built-in, recomendada)

A partir do Poetry 2.0, o comando `poetry shell` foi removido do núcleo. No lugar, existe
`poetry env activate`, que **imprime** o comando de ativação em vez de ativá-lo diretamente
(porque um subprocesso do Poetry não consegue alterar o shell que o chamou). Por isso, você
precisa executar o comando impresso, com `eval`:

```bash
eval $(poetry env activate)
```

Ou, de forma equivalente e mais explícita:

```bash
source "$(poetry env info --path)/bin/activate"
```

Depois disso, o prompt do terminal deve mostrar o nome do ambiente virtual entre parênteses
(ex.: `(boilerplate-py3.12)`), e os comandos funcionam sem o prefixo:

```bash
python manage.py runserver
python manage.py migrate
python manage.py createsuperuser
```

Para sair do ambiente virtual e voltar ao Python do sistema:

```bash
deactivate
```

> ⚠️ A ativação vale **só para o terminal atual**. Se você abrir um terminal novo, precisa
> ativar de novo nele.

### Opção 2 — reinstalar o comando `poetry shell` via plugin

Se você preferir a sintaxe antiga (`poetry shell`), instale o plugin oficial uma única vez:

```bash
poetry self add poetry-plugin-shell
```

A partir daí, basta rodar, dentro da pasta do projeto:

```bash
poetry shell
```

Isso abre um novo subshell já com o ambiente virtual ativado (para sair, digite `exit`).

### Dica para o seu editor (VS Code)

Independentemente da opção escolhida, para que o VS Code (autocomplete, lint do Pylance, debug)
use o Python correto, aponte o interpretador do workspace para o caminho do ambiente virtual do
Poetry:

```bash
poetry env info --path
```

Use o caminho impresso (algo como `.../virtualenvs/boilerplate-xxxxxxxx-py3.12`) para selecionar
o interpretador em **Python: Select Interpreter** na paleta de comandos do VS Code.

---

## Rodando o projeto em desenvolvimento

Você precisa de **dois processos rodando ao mesmo tempo**, em dois terminais:

**Terminal 1 — Django (backend):**

```bash
poetry run python manage.py runserver
```

**Terminal 2 — Vite (frontend, com HMR):**

```bash
npm run dev
```

Depois, acesse **http://127.0.0.1:8000** (a porta do Django — é nela que você navega, não na
porta 5173 do Vite). O Django renderiza o HTML e injeta automaticamente os scripts/estilos
vindos do servidor Vite (rodando em `http://0.0.0.0:5173`), incluindo o cliente de HMR.

> ⚠️ Se você abrir só `http://localhost:5173`, verá apenas os assets "crus" do Vite, sem o
> template Django por trás — o fluxo correto é sempre acessar pela porta do Django.

---

## Como o Django conversa com o Vite

Vale a pena entender esse encanamento, porque é o coração do boilerplate:

1. **[vite.config.js](/home/leandrojatai/desenvolvimento/envs/boilerplate/vite.config.js)** define:
   - `root`: a pasta `_frontend/src` é a raiz do projeto Vite;
   - `base: '/static/'`: os assets gerados serão referenciados sob `/static/`, que é a mesma
     `STATIC_URL` configurada no Django;
   - `build.outDir`: a saída do build vai para `_frontend/dist`;
   - `build.manifest: true`: gera `_frontend/dist/.vite/manifest.json`, usado pelo `django-vite`
     para saber qual arquivo final (com hash) corresponde a cada entrada;
   - `build.rollupOptions.input.main`: o ponto de entrada é `_frontend/src/main.js`.

2. **[boilerplate/settings.py](/home/leandrojatai/desenvolvimento/envs/boilerplate/boilerplate/settings.py)**
   configura o app `django_vite` e a variável `DJANGO_VITE`:
   - `dev_mode` acompanha `DEBUG`. Com `DEBUG=True`, o Django busca os assets no servidor Vite
     (`localhost:5173`) com HMR ativo; com `DEBUG=False`, ele lê o `manifest.json` gerado pelo
     build e aponta para os arquivos finais com hash, servidos como arquivos estáticos normais.

3. **[_templates/base.html](/home/leandrojatai/desenvolvimento/envs/boilerplate/_templates/base.html)**
   usa as tags do `django_vite`:
   ```django
   {% load i18n static django_vite %}
   ...
   {% vite_hmr_client %}
   {% vite_asset 'main.js' %}
   ```
   - `{% vite_hmr_client %}` só injeta algo quando `dev_mode` está ativo (HMR do Vite).
   - `{% vite_asset 'main.js' %}` injeta o `<script>`/`<link>` correto do ponto de entrada,
     seja apontando para o dev server ou para o build final.
   - A página também expõe uma `<div id="bp-app">`, que é onde o Vue vai ser montado quando
     você o configurar (veja a seção [O estado atual do Vue](#o-estado-atual-do-vue--e-o-seu-exercício)).

4. **[_frontend/src/main.js](/home/leandrojatai/desenvolvimento/envs/boilerplate/_frontend/src/main.js)**
   é o único ponto de entrada declarado no `vite.config.js`. Hoje ele só importa o polyfill do
   Vite, o SCSS global e um script de exemplo (`js/index.js`, veja
   [index.js](/home/leandrojatai/desenvolvimento/envs/boilerplate/_frontend/src/js/index.js)) que usa jQuery + axios para mostrar que
   o bundler está funcionando — não há Vue sendo inicializado ainda.

5. O app Django de exemplo, **`boilerplate.core`**, tem uma view simples
   ([views.py](/home/leandrojatai/desenvolvimento/envs/boilerplate/boilerplate/core/views.py)) que renderiza
   [core/index.html](/home/leandrojatai/desenvolvimento/envs/boilerplate/_templates/core/index.html), que por sua vez estende o
   `base.html`. Use esse app como modelo para criar os seus próprios apps Django.

---

## O código do backend em detalhes

Esta seção percorre, arquivo por arquivo, tudo que já existe no backend. A ideia é que você
não precise adivinhar "para que serve isso" — leia esta seção com o arquivo correspondente
aberto ao lado.

### `manage.py`

É o utilitário de linha de comando do Django ([manage.py](/home/leandrojatai/desenvolvimento/envs/boilerplate/manage.py)).
Toda a interação com o projeto pela CLI passa por ele: `runserver`, `migrate`, `makemigrations`,
`createsuperuser`, `shell`, `test`, etc. Internamente ele só define a variável de ambiente
`DJANGO_SETTINGS_MODULE=boilerplate.settings` e delega para
`django.core.management.execute_from_command_line`. Você sempre vai rodá-lo prefixado com
`poetry run`, para garantir que está usando o ambiente virtual correto:

```bash
poetry run python manage.py <comando>
```

### O pacote `boilerplate/` (configuração do projeto Django)

Em um projeto Django, existe sempre um pacote "de configuração" com o mesmo nome do projeto —
aqui é o pacote [boilerplate/](/home/leandrojatai/desenvolvimento/envs/boilerplate/boilerplate). Ele **não é um app** com models/views de negócio; é
onde moram as configurações globais.

- **[`__init__.py`](/home/leandrojatai/desenvolvimento/envs/boilerplate/boilerplate/__init__.py)** — vazio, só marca a pasta como pacote Python.

- **[`settings.py`](/home/leandrojatai/desenvolvimento/envs/boilerplate/boilerplate/settings.py)** — o arquivo mais importante do backend. Principais blocos:
  - `BASE_DIR`: raiz do projeto, calculada a partir do próprio arquivo, usada para montar todos
    os outros caminhos (`STATIC_ROOT`, `DATABASES`, templates, etc.).
  - `SECRET_KEY` e `DEBUG = True`: valores de **desenvolvimento**. O próprio Django já avisa, no
    comentário acima da chave, que ela precisa ser trocada e mantida em segredo em produção
    (idealmente via variável de ambiente, nunca hardcoded no repositório).
  - `INSTALLED_APPS`: os apps padrão do Django (`admin`, `auth`, `contenttypes`, `sessions`,
    `messages`, `staticfiles`), mais os dois apps específicos deste boilerplate:
    `django_vite` (integração com o Vite, explicada na seção anterior) e `boilerplate.core`
    (o app de exemplo).
  - `MIDDLEWARE`: a pilha padrão de middlewares de segurança/sessão/CSRF/mensagens do Django —
    nada customizado aqui.
  - `ROOT_URLCONF = 'boilerplate.urls'`: aponta para o arquivo de rotas raiz, descrito abaixo.
  - `TEMPLATES`: note que `DIRS` inclui `BASE_DIR / '_templates'` — é por isso que templates
    "globais" (como `base.html`) ficam em [_templates/](/home/leandrojatai/desenvolvimento/envs/boilerplate/_templates) na raiz, em vez de
    dentro de um app. `APP_DIRS: True` também permite que cada app tenha sua própria pasta
    `templates/` (é o caso de `core/index.html`, que vive em `_templates/core/` graças à
    convenção de nomes do Django de procurar `<diretório>/<nome_do_app>/<template>.html`).
  - `WSGI_APPLICATION = 'boilerplate.wsgi.application'`: usado pelo `runserver` e por servidores
    WSGI em produção (Gunicorn, uWSGI etc.).
  - `DATABASES`: usa **SQLite** (`db.sqlite3` na raiz do projeto) — ótimo para desenvolvimento e
    para este tutorial, mas normalmente trocado por PostgreSQL/MySQL em produção. Note que
    `db.sqlite3` está no `.gitignore`: cada estagiário terá seu próprio banco local, gerado pelas
    migrations.
  - `AUTH_PASSWORD_VALIDATORS`: os validadores padrão de força de senha do Django (tamanho
    mínimo, senha não pode ser só números, não pode ser uma senha comum, etc.), usados pelo
    `createsuperuser` e por qualquer formulário de troca de senha.
  - `LANGUAGE_CODE`, `TIME_ZONE`, `USE_I18N`, `USE_TZ`: configuração de internacionalização —
    hoje em inglês/UTC por padrão do `startproject`, mas os templates já estão com
    `lang="pt-br"` fixo em `base.html`. Se for alterar o idioma do projeto, ajuste aqui.
  - `MAILERS`: um bloco com o backend de e-mail de console (`django.core.mail.backends.console.EmailBackend`),
    que imprime e-mails no terminal em vez de enviá-los de verdade. ⚠️ Atenção: essa chave não é
    a configuração padrão do Django (que usa `EMAIL_BACKEND` direto, não um dicionário
    `MAILERS`) — então, hoje, nada no projeto efetivamente usa esse bloco ainda. Fica como ponto
    de atenção caso você precise configurar envio de e-mail: use `EMAIL_BACKEND` (ou a lib que o
    time decidir adotar) e teste se o backend está realmente sendo lido.
  - `STATIC_URL`, `STATIC_ROOT`: padrão do Django para arquivos estáticos.
  - `DJANGO_VITE_ASSETS_PATH` e `STATICFILES_DIRS`: aqui é onde o Django aprende a enxergar os
    arquivos gerados pelo Vite (`_frontend/dist`) como arquivos estáticos. Em `DEBUG=True`,
    também é adicionada a pasta `_frontend/src/assets` (o `publicDir` do Vite), para que imagens
    e outros arquivos públicos funcionem em desenvolvimento mesmo sem build.
  - `DJANGO_VITE_DEV_MODE` e `DJANGO_VITE`: explicados em detalhe na seção
    [Como o Django conversa com o Vite](#como-o-django-conversa-com-o-vite).

- **[`urls.py`](/home/leandrojatai/desenvolvimento/envs/boilerplate/boilerplate/urls.py)** — o roteador raiz do projeto:
  - `admin/` → interface administrativa pronta do Django (`django.contrib.admin`).
  - `''` (raiz) → `include('boilerplate.core.urls')`, ou seja, todas as rotas do app `core` são
    "plugadas" na raiz do site. É assim que você vai conectar as rotas dos seus próprios apps:
    criando um `urls.py` no app e incluindo-o aqui (ou em outro nível, se preferir organizar por
    prefixo, ex.: `path('contratos/', include('boilerplate.contratos.urls'))`).
  - Quando `DEBUG=True`, o Django também passa a servir diretamente os arquivos de `MEDIA_URL` e
    `STATIC_URL` (útil só em desenvolvimento; em produção isso é tarefa do servidor web/CDN).
    ⚠️ Ponto de atenção: `MEDIA_URL`/`MEDIA_ROOT` não são definidos explicitamente em
    `settings.py` — o Django usa os valores padrão (`''`), então, por enquanto, essa parte do
    `static()` não serve nenhum diretório de mídia de fato. Se o seu app precisar de upload de
    arquivos, defina `MEDIA_URL` e `MEDIA_ROOT` em `settings.py` antes de usar esses recursos.

- **[`wsgi.py`](/home/leandrojatai/desenvolvimento/envs/boilerplate/boilerplate/wsgi.py)** e
  **[`asgi.py`](/home/leandrojatai/desenvolvimento/envs/boilerplate/boilerplate/asgi.py)** — pontos de entrada para servidores de produção.
  `wsgi.py` é usado por servidores síncronos tradicionais (Gunicorn, uWSGI); `asgi.py` é usado
  por servidores assíncronos (Daphne, Uvicorn) e é pré-requisito caso você venha a adicionar
  recursos assíncronos (ex.: WebSockets com Django Channels). Nenhum dos dois precisa ser
  editado no dia a dia — eles só expõem o `application` que o servidor WSGI/ASGI escolhido vai
  importar.

### O app `boilerplate.core` (app de exemplo)

Fica em [boilerplate/core/](/home/leandrojatai/desenvolvimento/envs/boilerplate/boilerplate/core) e serve como **modelo mínimo** de um app Django — use-o como
referência de estrutura ao criar seus próprios apps (ex.: `boilerplate/contratos/`,
`boilerplate/usuarios/`, etc.).

- **[`apps.py`](/home/leandrojatai/desenvolvimento/envs/boilerplate/boilerplate/core/apps.py)** — define `CoreConfig(AppConfig)`. Repare que `name = 'boilerplate.core'`
  (o caminho completo do pacote Python, já que o app vive dentro do pacote `boilerplate/` em vez
  de na raiz do repositório) e `label = 'core'` (um apelido curto, necessário porque o Django
  normalmente deriva o label do último segmento de `name` — como aqui isso já seria `core`, o
  label explícito só deixa a intenção clara). É esse `name` que aparece em `INSTALLED_APPS` e
  que o `urls.py` do app usa via `CoreConfig.name` para definir `app_name`.

- **[`models.py`](/home/leandrojatai/desenvolvimento/envs/boilerplate/boilerplate/core/models.py)** — vazio (só o comentário padrão `# Create your models here.`).
  Nenhuma tabela própria foi criada ainda; é aqui que você vai declarar suas classes `models.Model`
  quando precisar persistir dados.

- **[`admin.py`](/home/leandrojatai/desenvolvimento/envs/boilerplate/boilerplate/core/admin.py)** — vazio. É aqui que você registraria seus models para que apareçam na
  interface `/admin/` (`admin.site.register(MeuModelo)`).

- **[`views.py`](/home/leandrojatai/desenvolvimento/envs/boilerplate/boilerplate/core/views.py)** — uma única *function-based view*, `index`, que apenas renderiza o
  template `core/index.html` (sem nenhum contexto adicional). É o exemplo mais simples possível
  de view no Django.

- **[`urls.py`](/home/leandrojatai/desenvolvimento/envs/boilerplate/boilerplate/core/urls.py)** — define `app_name = CoreConfig.name` (usado para *namespacing* de URLs,
  ex.: `{% url 'boilerplate.core:index' %}` nos templates) e uma única rota, `''`, apontando
  para `views.index` com o nome `index`.

- **[`migrations/`](/home/leandrojatai/desenvolvimento/envs/boilerplate/boilerplate/core/migrations)** — contém só o `__init__.py` padrão. Como `models.py` ainda está
  vazio, não há nenhuma migration gerada; assim que você criar seu primeiro model, rode
  `poetry run python manage.py makemigrations` para gerar o arquivo de migration correspondente,
  e `migrate` para aplicá-lo ao banco.

- **[`tests.py`](/home/leandrojatai/desenvolvimento/envs/boilerplate/boilerplate/core/tests.py)** — vazio, só o esqueleto padrão com `TestCase` importado. É aqui (ou em um
  pacote `tests/`, se o app crescer) que você escreveria os testes automatizados do app, e
  rodaria com `poetry run python manage.py test`.

---

## Build de produção

```bash
npm run build
```

Isso gera `_frontend/dist/` com os arquivos finais (JS/CSS com hash) e o `manifest.json`.
Depois, com `DEBUG=False`, rode:

```bash
poetry run python manage.py collectstatic
```

para copiar tudo (incluindo o build do Vite) para `STATIC_ROOT`, pronto para ser servido por
um servidor web/CDN em produção.

Para conferir localmente como fica o build sem subir um servidor de produção completo, você
pode usar `npm run preview` (serve o conteúdo de `_frontend/dist` isoladamente, só para
inspeção dos assets — não substitui o `runserver` do Django).

---

## Qualidade de código (lint e format)

```bash
npm run lint     # ESLint, com --fix automático (regras de JS e Vue)
npm run format    # Prettier, formata tudo em _frontend/src
```

Recomendado rodar os dois antes de qualquer commit. As regras já estão prontas para arquivos
`.vue`, então quando você começar a criar componentes Vue, o lint já vai cobri-los.

---

## O estado atual do Vue — e o seu exercício

Este é o ponto mais importante para quem está aprendendo com este boilerplate:

**O Vue, o vue-router e o Pinia já estão instalados** (veja as `dependencies` em
[package.json](/home/leandrojatai/desenvolvimento/envs/boilerplate/package.json)), mas **propositalmente não estão configurados**.
Não existe nenhum arquivo `.vue`, nenhum `createApp()`, nenhum router ou store. Isso é
intencional: o objetivo é que você aprenda a dar os próximos passos sozinho(a), em vez de
herdar uma SPA já pronta.

### Seu desafio

Usando o que já existe (`main.js`, `vite.config.js`, a `<div id="bp-app">` em `base.html`),
configure o Vue do zero. Sugestão de roteiro:

1. **Crie seu primeiro componente**, por exemplo `_frontend/src/components/App.vue`:
   ```vue
   <template>
     <h1>Olá, Vue!</h1>
   </template>
   ```

2. **Monte a aplicação Vue em `main.js`**, apontando para a div que já existe no template
   (`#bp-app`):
   ```js
   import { createApp } from 'vue'
   import App from './components/App.vue'

   createApp(App).mount('#bp-app')
   ```
   > Dica: observe o alias `'vue': 'vue/dist/vue.esm-bundler.js'` já configurado em
   > [vite.config.js](/home/leandrojatai/desenvolvimento/envs/boilerplate/vite.config.js) — ele é necessário para que os templates
   > `.vue` sejam compilados corretamente pelo bundler. Observe também o alias `'~@'`, que
   > aponta para `_frontend/src` — use-o para importar seus arquivos (`import App from '~@/components/App.vue'`).

3. **Rode `npm run dev`** e recarregue a página servida pelo Django. Se tudo estiver certo,
   você verá "Olá, Vue!" renderizado dentro de `#bp-app`, e o HMR vai atualizar a página
   automaticamente a cada alteração do componente.

4. **Adicione o vue-router**, criando `_frontend/src/router/index.js` com suas rotas, e registre
   o plugin: `app.use(router)`.

5. **Adicione o Pinia** da mesma forma: `import { createPinia } from 'pinia'` e `app.use(pinia)`,
   e crie sua primeira store em `_frontend/src/stores/`.

6. **Decida como Django e Vue vão coexistir.** Duas abordagens comuns:
   - Vue "mounta" só em pontos específicos de páginas renderizadas pelo Django (ilhas de
     interatividade) — bom para evoluir uma página de cada vez.
   - Vue assume uma SPA completa dentro de `#bp-app`, com vue-router controlando a navegação, e
     o Django vira basicamente uma API + servidor de um único template "casca".

   Não existe resposta errada — o importante é entender o trade-off antes de escolher.

Sinta-se à vontade para errar, refazer e perguntar. O objetivo deste exercício é consolidar o
entendimento de como o Vite builda um app Vue e como ele se conecta ao restante do projeto.

---

## Problemas comuns (troubleshooting)

- **A página carrega sem estilo/JS, ou o navegador reclama de `ECONNREFUSED` na porta 5173**
  Verifique se `npm run dev` está rodando. Com `DEBUG=True`, o Django *depende* do servidor Vite
  estar no ar para servir os assets.

- **`manifest.json` não encontrado / erro ao rodar com `DEBUG=False`**
  Rode `npm run build` antes. O `django-vite` lê o manifesto gerado em
  `_frontend/dist/.vite/manifest.json` apenas quando `dev_mode=False`.

- **Aviso do `collectstatic`/`runserver` sobre diretórios inexistentes em `STATICFILES_DIRS`**
  É esperado logo após clonar o projeto: `_frontend/dist` só existe depois do primeiro
  `npm run build`, e `_frontend/src/assets` só existe se você criar essa pasta para colocar
  imagens/fontes estáticas servidas diretamente pelo Vite (`publicDir`).

- **Alterei um `.vue` ou `.js` e nada muda no navegador**
  Confirme que `npm run dev` está ativo (não `npm run build`, que não tem watch/HMR) e que você
  está acessando pela porta do Django (8000), não pela porta do Vite (5173).

- **Erro de import `~@/...`**
  Esse alias aponta para `_frontend/src` (configurado em `resolve.alias` do
  [vite.config.js](/home/leandrojatai/desenvolvimento/envs/boilerplate/vite.config.js)). Ele só funciona dentro de arquivos
  processados pelo Vite — não use esse alias em código Python/Django.

---

## Licença

Distribuído sob a licença MIT — veja [LICENSE](/home/leandrojatai/desenvolvimento/envs/boilerplate/LICENSE) para detalhes.
