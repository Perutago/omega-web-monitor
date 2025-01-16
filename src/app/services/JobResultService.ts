import JobResult from '../../core/entities/JobResult';
import IRepository from '../../core/repositories/IJobResultRepository';

export default class JobResultService<T extends IRepository> {
    private repository: T;

    constructor(repository: new () => T) {
        this.repository = new repository();
    }

    async list(): ResultType<JobResult[]> {
        return {
            success: true,
            data: await this.repository.readAll(),
        };
    }

    async get(id: string): ResultType<JobResult> {
        const jobResult = await this.repository.read(id);
        return {
            success: true,
            data: await this.repository.read(id),
        };
    }
}
