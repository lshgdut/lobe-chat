import { resolve } from 'node:path';

import download_npm_package from './download-npm-package';


async function main() {
  await download_npm_package('@qingling-ai/agents-index@1.0.2', resolve(__dirname, '../../', 'public', 'agents-index'))

  await download_npm_package('@qingling-ai/plugins-index@1.0.0', resolve(__dirname, '../../', 'public', 'plugins-index'))
}

// eslint-disable-next-line unicorn/prefer-top-level-await
main().catch(console.error)
