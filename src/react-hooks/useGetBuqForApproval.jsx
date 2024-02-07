import { useState } from "react";
import useServerService from "./useServerService";

const useGetBuqsForApproval = (buqProgramId) => {
    const [buqsForApproval, setBuqsForApproval] = useState();
    const buqService = useServerService("buqService");

    const fetchBuqsForApproval = () => {
        buqService
            .getBuqsForApproval(buqProgramId)
            .then((fetchedBuqsForApproval) => {
                const { content } = fetchedBuqsForApproval;
                setBuqsForApproval(content);
            });
    };

    return {
        fetchBuqsForApproval,
        buqsForApproval
    };
};

export default useGetBuqsForApproval;
