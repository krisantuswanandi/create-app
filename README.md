# Create Santus App

Generate a new project based on boilerplates from [github.com/krisantuswanandi](http://github.com/krisantuswanandi).

## Usage

To create a new project, run:

```sh
npm create @santus/app@latest
yarn create @santus/app
pnpm create @santus/app@latest
```

You can also directly specify the project name using:

```sh
npm create @santus/app@latest project-name
yarn create @santus/app project-name
pnpm create @santus/app@latest project-name
```

## Development

To build the project for local environment, run:

```sh
pnpm install
pnpm run dev
```

Install the local package manually, run:

```sh
npm link # haven't been able to use pnpm to install global bin
```

Check if the package is installed, run:

```sh
create-app -h
```
