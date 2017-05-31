#httrack famous.org/docs -O famous.org -n -T30 -B -v '-github.com*' '+*famous.org*'
#httrack famo.us/docs -O famo.us -n -T30 -B '+*amazonaws.com/*famo.us*'

# previous two combined
httrack
    famous.org/docs \
    famo.us/docs \
    famous.org/examples/blocks/position/manifest.json \
    famous.org/examples/blocks/align/manifest.json \
    famous.org/examples/blocks/alignposition/manifest.json \
    famous.org/examples/blocks/mountpoint/manifest.json \
    famous.org/examples/blocks/origin/manifest.json \
    famous.org/examples/blocks/positioncomponent/manifest.json \
    staging.famous.org/examples/blocks/hello-famous/manifest.json \
    famous.org/examples/blocks/click/manifest.json \
    famous.org/examples/blocks/bubbleup/manifest.json \
    famous.org/examples/blocks/customevent/manifest.json \
    famous.org/examples/blocks/drag/manifest.json \
    famous.org/examples/blocks/draginput/manifest.json \
    staging.famous.org/examples/blocks/sphere/manifest.json \
    staging.famous.org/examples/blocks/gravity3d/manifest.json \
    famous.org/learn/assets/projects/mixedmode/macbook2.obj \
    -O ./ -n -T30 -B -v '-*slack.com*' '-*github.com*' '+*famous.org*' '+*amazonaws.com/*famo.us*' '+*.json' '+*.ttf'
