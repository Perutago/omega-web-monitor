import Service from './Service';
import Repository from '../../core/repositories/CsvJobResultRepository';

export default class JobResultService extends Service {
    private repository = new Repository();

    async list() {
        try {
            const data = await this.repository.readAll();
            return {
                success: true,
                data
            };
        } catch (error) {
            return this.handleError(error);
        }
    }

    async get(id: string) {
        const jobResult = await this.repository.read(id);
        return {
            success: true,
            data: jobResult
        };
    }
}
