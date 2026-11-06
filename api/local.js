'strict mode';

// Local images
const images = require("../images/images.json").images;

const cycleStart = images.length > 1 ? 1 : 0;
const displayed = (index) => {
    if (index < images.length) return { ...images[index], image_id: index };
    const cycleLength = images.length - cycleStart;
    const cycleIndex = cycleStart + ((index - cycleStart) % cycleLength);
    return { ...images[cycleIndex], image_id: index };
};

module.exports = {
    fetchList: async function (from, count) {
        if (!images.length) return [];
        return Array.from({ length: count }, (_, i) => displayed(from + i));
    },
    fetchImage: async function (obj, advicedResolution) {
        const url = "images/" + obj.file;
        const blob = await fetch(url).then(res => res.blob());
        return {
            title: obj.title,
            image: blob
        };
    }
};
