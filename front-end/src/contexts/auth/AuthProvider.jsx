import {AuthReducer, InitialState} from './AuthReducer.js';
import {useEffect, useReducer, useState} from "react";
import {AuthContext} from "./AuthContext.jsx";
import UserApi from "../../services/UserApi.js";
import Spinner from "../../componets/Spinner.jsx";

export const AuthProvider = ({children}) => {
    const [state, dispatch] = useReducer(AuthReducer, InitialState);

    const [isLoading, setIsLoading] = useState(true);

    const checkToken = async () => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken){
            setIsLoading(false);
            return;
        }

        try {
            const response = await UserApi.getProfile();

            if (response.status === 200 && response.data?.data) {
                const {id, username, fullName, role, email, phone, avatar, address, ward, district, province} = response.data.data;
                dispatch({
                    type: 'LOGIN',
                    payload: {
                        accessToken,
                        user: {id, username, fullName, role, email, phone, avatar, address, ward, district, province}
                    }
                });
            }
            if (response.status !== 200) {
                dispatch({type: 'LOGOUT'});
            }
        } catch (err) {
            console.error("Token không hợp lệ:", err);
            dispatch({type: 'LOGOUT'});
        }
        finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        checkToken();
    }, []);

    if(isLoading) {
        return <Spinner/>
    }

    return (
        <AuthContext.Provider value={{state, dispatch}}>
            {children}
        </AuthContext.Provider>
    );
};