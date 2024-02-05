import useLocalStorage from './useLocalStorage';

const useGetBuqProgram = () => {
  const {
    storedItems: { userPrograms },
  } = useLocalStorage();

  const programBuq = userPrograms?.find((program) => program.name === 'BUQ');

  return { programBuq };
};

export default useGetBuqProgram;
