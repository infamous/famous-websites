#httrack famous.org/docs -O famous.org -n -T30 -B -v '-github.com*' '+*famous.org*'
#httrack famo.us/docs -O famo.us -n -T30 -B '+*amazonaws.com/*famo.us*'

# previous two combined
httrack famous.org/docs famo.us/docs -O ./ -n -T30 -B -v '-*slack.com*' '-*github.com*' '+*famous.org*' '+*amazonaws.com/*famo.us*' '+*.json' '+*.ttf'
