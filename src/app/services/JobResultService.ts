import Entity from '../../core/entities/JobResult';
import IRepository from '../../core/repositories/IJobResultRepository';
import RepositoryFactory from '../../core/repositories/RepositoryFactory';
import { ResultType } from './ResultType';

export default class JobResultService {
    private repository: IRepository;

    constructor() {
        this.repository = RepositoryFactory.getJobResult();
    }

    async list(): ResultType<Entity[]> {
        return {
            success: true,
            data: await this.repository.readAll(),
        };
    }

    async get(id: string): ResultType<Entity> {
        return {
            success: true,
            data: await this.repository.read(id),
        };
    }
}
