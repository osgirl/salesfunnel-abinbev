import getMuiTheme from 'material-ui/lib/styles/getMuiTheme';
import * as Colors from 'material-ui/lib/styles/colors';

export const muiTheme = getMuiTheme({
    palette: {
        primary1Color: Colors.red400,
        primary2Color: Colors.amber500,
        primary3Color: Colors.green300
    }
}, {
    avatar: {
        borderColor: null
    },
    userAgent: 'all'
});