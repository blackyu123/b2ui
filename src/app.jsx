import "./app.scss";
import "./color.css";
import "./border-color.css";
import 'react-toastify/dist/ReactToastify.css';
import 'react-table/react-table.css';
import React, {useState, useReducer, useEffect} from "react";
import {BrowserRouter, Switch, Route} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import {routeInitState, routeReducer} from "./reducers/routeReducer";
import LoginPage from "./pages/loginPage/loginPage";
import Layout from "./layout/layout";
import DataSource from "./data/datasource";
import Notifier from "./helpers/notifier";
import MyNotification from "./components/notification";
import Check from "./components/customIf/customIf";
import SlideModal from "./components/slideModal";
import {Button, Modal, ModalBody, ModalFooter} from "reactstrap";
import {hasPermit} from "./helpers/util";
import constPermissions from "./const/constPermissions";
import Toast from "./helpers/toast";
import {filterInitState, filterReducer} from "./reducers/filterReducer";
import {commonContentReducer, commonContentInitState} from "./reducers/commonContentReducer";
import 'handsontable/dist/handsontable.full.css';

export const RootContext = React.createContext({
    routeStore: {},
    companyStore: null
});

export const withRootConsumer = (Component) => {
    return React.forwardRef((props, ref) => {
        return (
            <RootContext.Consumer>
                {value => <Component {...props} ref={ref} companyStore={value?.companyStore}
                                     dispatch={value?.dispatch}/>}
            </RootContext.Consumer>
        );
    });
};

const companyReducer = (state, action) => {
    switch (action.type) {
        case "setCompany":
            return {...state, ...action.payload};
    }
    return {...state};
};

const isLocal = process && process.env && process.env.ENV === "local" || false;

const App = () => {
    const [routeStore, routeDispatch] = useReducer(routeReducer, routeInitState);
    const [companyStore, companyDispatch] = useReducer(companyReducer, null);
    const [filterStore, filterDispatch] = useReducer(filterReducer, filterInitState);
    const [commonContentStore, commonContentDispatch] = useReducer(commonContentReducer, commonContentInitState);
    const [setupList, setSetupList] = useState([]);
    const [showModal, setShowModal] = useState(false);

    // initialization, run once
    useEffect(() => {
        const initPostLogin = async () => {
            await DataSource.shared.refreshPermissions();
            getCompanySingleConstSetting().then();
            checkIfPlatformSet().then().catch();
            Notifier.shared.start();
        };
        const init = async () => {
            if (DataSource.shared.claims !== null) {
                await initPostLogin();
            }
            initRoutes();
        };
        init().then();

        try {
            let hostName = window.location.hostname;
            if (hostName.includes("wwwdj.payhome")) {
                document.title += " cstest";
            } else if (hostName.includes("localhost")) {
                document.title += " local";
            }

        } catch (err) {
            console.warn(err);
        }

    }, []);

    useEffect(() => {
        if (setupList?.length > 0) {
            setShowModal(true);
        } else {
            setShowModal(false);
        }
    }, [setupList]);

    const getCompanySingleConstSetting = async () => {
        try {
            const response = await DataSource.shared.getSingleCompanyConstSetting();
            const {
                companyConstant = {}, name = "", alias
            } = response || {};

            companyDispatch({
                type: "setCompany",
                payload: {
                    ...(companyConstant?.data || {}),
                    companyName: name,
                    alias
                }
            });

        } catch (err) {
            Toast.init.error.show(err);
        }
    };


    const checkIfPlatformSet = async () => {
        try {
            const response = await DataSource.shared.getPlatformTable();

            if (response?.docs === undefined || response?.docs?.length === 0) {
                setSetupList([...setupList, "platform"]);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const initRoutes = () => {
        const {location} = window;
        const linkHistory = window.localStorage.getItem("linkHistory");
        let savedRoutes = JSON.parse(linkHistory);
        if (!Array.isArray(savedRoutes)) {
            savedRoutes = [];
            window.localStorage.setItem("linkHistory", "[]");
        }

        if (savedRoutes && !savedRoutes.includes(location.pathname) && location.pathname !== "/") {
            savedRoutes.push(location.pathname);
            window.localStorage.setItem("linkHistory", JSON.stringify(savedRoutes));
        }

        if (savedRoutes) {
            routeDispatch({type: "initRoutes", data: savedRoutes});
        }
    };

    return (
        <React.Fragment>

        </React.Fragment>
    );
};

export default App;


