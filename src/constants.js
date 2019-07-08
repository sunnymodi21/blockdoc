import { AppConfig } from 'blockstack'

export const appConfig = new AppConfig(['store_write', 'publish_data'])

export const cameraConstraints = { video: { facingMode: "environment" }, audio: false };