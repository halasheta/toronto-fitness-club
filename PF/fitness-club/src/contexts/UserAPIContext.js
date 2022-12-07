import {createContext, useState} from "react";

const UserContext = createContext({
    isAdmin: null,
    setIsAdmin: () => {},
    subscription: null,
    setSubscription: () => {}
});

export const useUserAPIContext = () => {
    const [isAdmin, setIsAdmin] = useState(null);
    const [subscription, setSubscription] = useState(null);

    return {
        isAdmin,
        setIsAdmin,
        subscription,
        setSubscription,
    }

}

export default UserContext;