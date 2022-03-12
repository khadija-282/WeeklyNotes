export class Globals {
    public static SERVICE_URI: string;
    public static MAXWEEK: number;
    public static MINWEEK: number;
    public static DAYSINWEEK: number;
    public static WEEKENDMIN: any;
    public static WEEKENDMAX: any;
    public static MAXSTACK: any;

    public static setGlobals(config: any) {
        Globals.SERVICE_URI = config.SERVICE_URI;
        Globals.MAXWEEK = config.MAXWEEK ? config.MAXWEEK : 52; ///since these values will not change we will give default values but keep things felxible we make it configurable 
        Globals.MINWEEK = config.MINWEEK ? config.MINWEEK : 1; ///to keep all constants at one place we will give defaults here
        Globals.DAYSINWEEK = config.DAYSINWEEK ? config.DAYSINWEEK : 7;
        Globals.WEEKENDMIN = config.WEEKENDMIN ? config.WEEKENDMIN : 0;
        Globals.WEEKENDMAX = config.WEEKENDMAX ? config.WEEKENDMIN : 6;
        Globals.MAXSTACK = config.MAXSTACK ? config.MAXSTACK : 3;
    }
}