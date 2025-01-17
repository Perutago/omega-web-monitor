import JobResult from '../../core/entities/JobResult';
import IRepository from '../../core/repositories/IJobResultRepository';
import RepositoryFactory from '../../core/repositories/RepositoryFactory';

export default class JobResultService {
    private repository: IRepository;

    constructor() {
        this.repository = RepositoryFactory.getJobResult();
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
