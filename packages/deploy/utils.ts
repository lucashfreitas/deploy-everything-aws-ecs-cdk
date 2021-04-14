


export const appName = (name: string) => {
    const env = process.env.DEPOY_ENV;

    return `${env}${name}`

}