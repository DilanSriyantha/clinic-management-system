import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { forwardRef, MouseEvent, useCallback, useImperativeHandle, useReducer } from "react";

export interface AlertDialogRef {
    setupAndOpen: (title: string, content: string, positiveText: string, negativeText: string, onPositiveAction?: () => void, onNegativeAction?: () => void) => void;
    open: () => void;
    close: () => void;
};

interface AlertDialogProps {
    title?: string;
    content?: string;
    positiveText?: string;
    negativeText?: string;
    onPositiveAction?: () => void;
    onNegativeAction?: () => void;
};

interface AlertDialogState {
    open: boolean;
    title?: string;
    content?: string;
    positiveText?: string;
    negativeText?: string;
    onPositiveAction?: () => void;
    onNegativeAction?: () => void;
};

const initialState: AlertDialogState = {
    open: false,
    title: "",
    content: "",
    positiveText: "",
    negativeText: "",
    onPositiveAction: () => {},
    onNegativeAction: () => {},
};

const enum ActionType {
    SET_ALL_PROPS,
    SET_SINGLE_PROP
};

const reducer = (state: AlertDialogState, action: { type: ActionType, payload: any }): AlertDialogState => {
    switch(action.type){
        case ActionType.SET_SINGLE_PROP:
            return { ...state, [action.payload.name]: action.payload.value };
        case ActionType.SET_ALL_PROPS:
            return { ...state, title: action.payload.title, content: action.payload.content, positiveText: action.payload.positiveText, negativeText: action.payload.negativeText, onPositiveAction: action.payload.onPositiveAction, onNegativeAction: action.payload.onNegativeAction, open: action.payload.open };
        default:
            return state;
    }
};

const AlertDialog = forwardRef<AlertDialogRef, AlertDialogProps>((props, ref) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    useImperativeHandle(ref, () => ({
        setupAndOpen: handleSetupAndOpen,
        open: handleOpen,
        close: handleClose
    }));

    const handleSetupAndOpen = useCallback((title: string, content: string, positiveText: string, negativeText: string, onPositiveAction?: () => void, onNegativeAction?: () => void) => {
        dispatch({type: ActionType.SET_ALL_PROPS, payload: {
            open: true,
            title: title,
            content: content,
            positiveText: positiveText,
            negativeText: negativeText,
            onPositiveAction: onPositiveAction,
            onNegativeAction: onNegativeAction
        }});
    }, []);

    const handleOpen = () => {
        dispatch({ type: ActionType.SET_SINGLE_PROP, payload: { name: "open", value: true } });
    };

    const handleClose = () => {
        dispatch({ type: ActionType.SET_SINGLE_PROP, payload: { name: "open", value: false } });
    };

    const handlePositiveClick = (e: MouseEvent<HTMLButtonElement>) => {
        props.onPositiveAction ? props.onPositiveAction() : state.onPositiveAction && state.onPositiveAction();
        handleClose();
    };

    const handleNegativeClick = (e: MouseEvent<HTMLButtonElement>) => {
        props.onNegativeAction ? props.onNegativeAction() : state.onNegativeAction && state.onNegativeAction();
        handleClose();
    };  

    return (
        <>
            <Dialog
                open={state.open}
                // onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    { props.title ? props.title : state.title }
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        { props.content ? props.content : state.content }
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color='error' onClick={handleNegativeClick}>{ props.negativeText ? props.negativeText : state.negativeText }</Button>
                    <Button onClick={handlePositiveClick}>{ props.positiveText ? props.positiveText : state.positiveText }</Button>
                </DialogActions> 
            </Dialog>
        </>
    );
});

export default AlertDialog;