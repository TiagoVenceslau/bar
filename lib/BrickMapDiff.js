'use strict';

const BrickMapMixin = require('./BrickMapMixin');

/**
 * Auguments a BrickMap with an operations
 * log
 * @param {object} options
 * @param {string} options.prevDiffHash
 */
function BrickMapDiff(header) {
    Object.assign(this, BrickMapMixin);

    this.initialize = function (header, callback) {
        if (typeof header === "function") {
            callback = header;
            header = undefined;
        }

        BrickMapMixin.initialize.call(this, header);
        this.load((err) => {
            if (err) {
                return OpenDSUSafeCallback(callback)(createOpenDSUErrorWrapper(`Failed to load BrickMapDiff`, err));
            }

            if (!this.header.metadata.log) {
                this.header.metadata.log = [];
            }

            callback();
        });
    }

    this.setPrevDiffHashLink = function (hashLink) {
        if (typeof hashLink === "undefined") {
            return;
        }
        this.header.metadata.prevDiffHashLink = hashLink.getIdentifier();
    }

    /**
     * @param {string} op
     * @param {string} path
     * @param {object|undefined} data
     */
    this.log = function (op, path, data) {
        const timestamp = this.getTimestamp()
        this.header.metadata.log.push({ op, path, timestamp, data });
    }

    /**
     * @param {string} path
     * @param {Array<object>} bricks
     */
    this.addFileEntry = function (path, bricks) {
        this.log('add', path, bricks);
    }

    /**
     * @param {string} path
     * @param {Array<object>} bricks
     */
    this.appendBricksToFile = function (path, bricks) {
        this.log('add', path, bricks);
    }

    /**
     * @param {string} path
     */
    this.emptyList = function (path) {
        this.log('truncate', path);
    }

    /**
     * @param {string} path
     */
    this.delete = function (path) {
        this.log('delete', path);
    }

    /**
     * @param {string} srcPath
     * @param {string} dstPath
     */
    this.copy = function (srcPath, dstPath) {
        this.log('copy', srcPath, dstPath)
    }

    /**
     * @param {string} path
     */
    this.createFolder = function (path) {
        this.log('createFolder', path);
    }
}
module.exports = BrickMapDiff;
