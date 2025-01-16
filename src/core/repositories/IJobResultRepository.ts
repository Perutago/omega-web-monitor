import JobResult from '../entities/JobResult';

export default interface IJobResultRepository {
    readAll(): Promise<JobResult[]>;

    read(jobId: string): Promise<JobResult | undefined>;

    create(entity: JobResult): void;
}