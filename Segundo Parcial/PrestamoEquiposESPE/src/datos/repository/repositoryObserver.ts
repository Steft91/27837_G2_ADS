export interface RepositoryObserver<T> {
  update(data: T[]): void;
}
