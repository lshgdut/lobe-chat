import pacote from 'pacote';
import fs from 'fs-extra';

import * as path from 'node:path';
import * as os from 'node:os';

/**
 * 从npm下载包并解压到指定目录
 * @param packageName - 包名，格式为 'package-name' 或 'package-name@version'
 * @param targetDir - 解压目标目录
 * @returns 解压完成后的目录路径
 */
export default async function downloadAndExtractNpmPackage(packageName: string, targetDir: string): Promise<string> {
  if (await fs.exists(targetDir)) {
    console.log(`清理目标目录 ${targetDir}...`);
    await fs.rm(targetDir, { recursive: true });
  }

  try {
    // 创建临时目录
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'npm-package-'));

    // 下载npm包到临时目录
    console.log(`正在下载 ${packageName}...`);
    const tarballFile = (await pacote.tarball.file(packageName, path.join(tempDir, 'package.tgz')));
    const tarballPath = tarballFile.resolved;
    console.log(`已下载到 ${tarballPath}`);

    // 创建目标目录（如果不存在）
    await fs.ensureDir(targetDir);

    // 解压tarball
    console.log(`正在解压到 ${targetDir}...`);
    await pacote.extract(tarballPath, targetDir, { strip: 1 })
    console.log('解压完成');

    // 清理临时目录
    await fs.remove(tempDir);

    return targetDir;
  } catch (error) {
    console.error('下载或解压过程中出错:', error);
    throw error;
  }
}
