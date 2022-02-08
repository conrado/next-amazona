interface ILoader {}
interface IInterface {}

export const useLoader = <T>({ i }: { i: IInterface }) => {};

const i = {};

const loadInterface = useLoader<ILoader>({ i });

const upLoader = () => {};
