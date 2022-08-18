# How to get live risk add-in development running

Follow this few steps to get the development running

## 1. Clone this repo

```sh
git clone htts://github.com/ryanridnn/liverisk-addin.git

# after cloning is successful

cd liverisk-addin
```

## 2. Install the dependencies

```sh
npm install

# or

yarn install

# or

pnpm install
```

## 3. Run the development server

```sh
npm run dev-server
```

Running the development server does not automatically open excel for desktop nor excel online

## 4. Open excel

```sh
# to start excel for desktop
npm start

# to start excel online
npm start:web -- --document {url}
# example
npm start:web -- --document https://onedrive.live.com/edit.aspx?resid=98A980DB4C1378BD!113&ithint=file%2cxlsx&authkey=!ACgGfuAufBzp-Go
```

More on excel add-in setup: https://docs.microsoft.com/en-us/office/dev/add-ins/quickstarts/excel-quickstart-jquery?tabs=yeomangenerator
