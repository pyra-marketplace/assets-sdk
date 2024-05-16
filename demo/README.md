# demo

## Install dependencies

```bash
pnpm install
```

## Running the demo

```bash
pnpm dev
```

## Building the demo

```bash
pnpm build
```

## Local Testing

Make sure you have the source code of Dataverse Kernel. Then, build the kernel and link it to the demo:

```bash
pnpm link $PATH_TO_KERNEL
```

Then, run the test:

```bash
pnpm test
```