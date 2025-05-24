import fsSync from 'fs';
import fs from 'fs/promises';
import i18n from 'i18n';

export default abstract class BaseJsonRepository<T> {
    protected abstract get jsonFilePath(): string;

    protected async readFile(): Promise<T[]> {
        if (fsSync.existsSync(this.jsonFilePath)) {
            return JSON.parse(await fs.readFile(this.jsonFilePath, 'utf8')) as T[];
        } else {
            throw new Error(i18n.__('Error.FileNotFound', this.jsonFilePath));
        }
    }

    protected async writeFile(entities: T[]): Promise<void> {
        const json = JSON.stringify(entities);
        await fs.writeFile(this.jsonFilePath, json);
    }
}
