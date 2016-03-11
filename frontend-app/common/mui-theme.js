import getMuiTheme from 'material-ui/lib/styles/getMuiTheme';
import themeDecorator from 'material-ui/lib/styles/theme-decorator';
import * as Colors from 'material-ui/lib/styles/colors';

const muiTheme = getMuiTheme({
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

export function initMaterialUi(app) {
    return themeDecorator(muiTheme)(app)
}