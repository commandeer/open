import { stack } from './stack';
import { App } from '@serverless-stack/resources';

export default function (app: App) {
  app.setDefaultFunctionProps({
    runtime: "nodejs16.x",
    srcPath: "backend",
    bundle: {
      format: "esm",
    },
  });

  app.stack(stack);
}
