const {auth, GoogleAuth} = require('google-auth-library')
const dateformat = require('dateformat');

const generateBackup = async () => {
    const client = await new GoogleAuth({
        scopes: [
            'https://www.googleapis.com/auth/datastore',
            'https://www.googleapis.com/auth/cloud-platform',
        ],
    });
    const timestamp = dateformat(Date.now(), 'yyyy-mm-dd');
    const path = `${timestamp}`;
    const BUCKET_NAME = `j-time-tracker-backups`;

    const projectId = await auth.getProjectId();
    const url = `https://firestore.googleapis.com/v1beta1/projects/${projectId}/databases/(default):exportDocuments`;
    const backup_route = `gs://${BUCKET_NAME}/${path}`;
    return client.request({
        url,
        method: 'POST',
        data: {
            outputUriPrefix: backup_route,
            // collectionsIds: [] // if you want to specify which collections to export, none means all
        },
    }).then(async (res) => {
        console.log(`Backup saved on folder on ${backup_route}`);
    })
        .catch(async (e) => {
            return Promise.reject({message: e.message})
        })
};

module.exports = generateBackup;
