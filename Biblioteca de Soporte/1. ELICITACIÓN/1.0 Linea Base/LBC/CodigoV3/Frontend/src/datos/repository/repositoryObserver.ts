export interface RepositoryObserver<T> {
  update(data: T[]): void;
  error?(error: Error): void;
}
