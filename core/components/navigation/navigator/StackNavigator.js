import { StackActions, CommonActions } from '@react-navigation/native';
import { throttle, isEmpty } from 'lodash';
import Navigator from './Navigator';

export default class StackNavigator extends Navigator {
    push = (route) => {
        this.navigate(route, 'StackScreen');
    }

    dismiss = () => { }

    pop = () => {
        this.popN(1);
    }

    popN = throttle((n) => {
        const action = StackActions.pop(n);
        this.navigation.dispatch(action);
    }, 1000, { leading: true, trailing: false });

    popToTop = () => {
        const action = StackActions.popToTop();
        this.navigation.dispatch(action);
    }

    splice = ({
        deleteFrom = 0, newIndex = null, deleteCount = 1, newRoute = null, nameStack = 'StackScreen'
    }) => {
        const { routes } = this.navigation.dangerouslyGetState();
        if (routes.length < deleteFrom) return console.warn(`Index of Stack is out of bounds. Stack length is ${routes.length} but received ${deleteFrom}`);
        const cloneRoutes = [...routes];
        if (isEmpty(newRoute)) {
            cloneRoutes.splice(deleteFrom, deleteCount);
        } else {
            const replaceRoute = {
                name: nameStack,
                key: `${nameStack}_${new Date().getTime()}`,
                params: {
                    ...newRoute
                }
            };
            cloneRoutes.splice(deleteFrom, deleteCount, replaceRoute);
        }
        const action = CommonActions.reset({
            index: newIndex || cloneRoutes.length,
            routes: cloneRoutes
        });
        this.navigation.dispatch(action);
    };

    replace = (route) => {
        const action = StackActions.replace('StackScreen', {
            ...route
        });
        this.navigation.dispatch(action);
    }

    reset = (route) => {
        const navigateRoute = {
            ...route,
            options: route.options || {}
        };
        const action = CommonActions.reset({
            index: 0,
            routes: [{
                name: 'StackScreen',
                key: `StackScreen_${new Date().getTime()}`,
                params: { ...navigateRoute }
            }]
        });
        this.navigation.dispatch(action);
    }
}
