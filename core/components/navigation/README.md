# MoMo Navigation

## Getting started

### npm

    $ npm install momo-component-kits

---

## Usage

    import {Navigation} from  'momo-components-kit';

## Example's

### Create Navigation

    class MoMoMiniApp extends  React.Component {
        ....
        console.log(this.props.params.message) //Output: "Hello word"
    }

    export default class MoMoMiniAppNavigation extends  React.Component {
        render() {
            return (
                <Navigation
                    defaultOptions: {}
                    options={{tilte: "MoMo Mini App"}}
                    screen={MoMoMiniApp}
                    screenProps={{ message: "Hello word" }}
        	   />
    	   )
        }
    }

### Push new screen

    let { navigator } = this.props;
    navigator.push({
        screen:  MoMoMiniAppDetail,
        defaultOptions: {}
        options: {title: "Detail"}
        screenProps: {message: "Hello Detail"}
    });

### Pop to Previous Screen

    let { navigator } = this.props;
    navigator.pop();

## Reference

### Props

#### screen
| Type   | Required | Desciption |
| ------ | -------- | ---- |
| function | Yes      | |

#### screenProps
| Type   | Required | Desciption |
| ------ | -------- | ---- |
| object | No      | |

#### defaultOptions
| Type   | Required | Desciption |
| ------ | -------- | ---- |
| object | No      | |

#### options
| Type   | Required | Desciption |
| ------ | -------- | ---- |
| object | No      | |


- **title**: string
- **header**: function
- **headerStyle**: style
- **headerTitle**: function
- **headerBackground**: node
- **headerTitleStyle**: textStyle
- **headerTintColor**: color
- **headerLeft**: function
- **headerLeftIcon**: ImageSourcePropType
- **headerLeftStyle**: style
- **headerRight**: function

---

### Methods

#### push(route: object)

Navigate forward to a new route.

---

#### pop()

Pop back to the previous scene.

---

#### popN(n: number)

Go back N scenes at once. When N=1, behavior matches pop().

---

#### popToTop()

Go back to the topmost item in the navigation stack.

---

#### replace(route)

Replace the route for the current scene and immediately load the view for the new route.

---

#### dismiss()

Dismiss all screens.