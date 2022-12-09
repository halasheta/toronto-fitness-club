import {createContext, useState} from "react";

const UserContext = createContext({
    isAdmin: null,
    setIsAdmin: () => {},
    subscription: null,
    setSubscription: () => {},
    classTypes: [],
    setClassTypes: () => {}
});

export const useUserAPIContext = () => {
    const [isAdmin, setIsAdmin] = useState(null);
    const [subscription, setSubscription] = useState(null);
    const [classTypes, setClassTypes] = useState([]);

    return {
        isAdmin,
        setIsAdmin,
        subscription,
        setSubscription,
        classTypes,
        setClassTypes
    }

}

export default UserContext;