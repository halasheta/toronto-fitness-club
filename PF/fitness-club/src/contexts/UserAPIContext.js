import {createContext, useState} from "react";

const UserContext = createContext({
    isAdmin: false,
    setIsAdmin: () => {},
    subscription: null,
    setSubscription: () => {}
});

export const useUserAPIContext = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [subscription, setSubscription] = useState(null);

    return {
        isAdmin,
        setIsAdmin,
        subscription,
        setSubscription,
    }

}

export default UserContext;