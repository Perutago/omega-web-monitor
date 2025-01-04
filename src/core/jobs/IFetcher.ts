export default interface IFetcher {
    fetch(): Promise<string>;
}
