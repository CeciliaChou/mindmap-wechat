// entity-detail.js
Component({
    /**
     * Component properties
     */
    properties: {
        title: String,
        description: String,
        avatarUrl: String,
        creator: String,
        useFooterSlot: {type: Boolean, value: false,}
    },

    options: {
        multipleSlots: true,
    }
});
