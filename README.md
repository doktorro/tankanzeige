# Tankanzeige

Mod für Claude Code. Zeigt über dem Eingabefeld, wie viel vom 5-Stunden- und vom 7-Tage-Limit noch frei ist und wann der Tank wieder voll ist:

```
⛽ Tank 5 h      ██████████████░░░░░░ 68 % frei · voll um 16:50 (in 2 h 8 min)
⛽ Tank 7 Tage   █████████████░░░░░░░ 65 % frei · voll um Mi., 06:00 (in 4 d 15 h)
```

Grün über 50 %, gelb bis 20 %, rot darunter. Angezeigt werden nur die eigenen Limits.

## Installation

In einer Claude-Code-Terminalsitzung:

```
/plugin install tankanzeige --marketplace doktorro/tankanzeige
```

Die Frage „Add marketplace?“ mit `y` bestätigen, dann den Bereich wählen (User = in allen Sitzungen).

Aus einer Shell:

```
claude plugin install tankanzeige --marketplace doktorro/tankanzeige
```

In der Desktop-App, wo `/plugin` nicht läuft: auf + neben dem Eingabefeld klicken, dann Plugins, Add marketplace mit `doktorro/tankanzeige`, dann Add plugin.
