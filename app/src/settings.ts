

export default {
  api_base_path: 'https://dl6ufv35bh.execute-api.us-west-2.amazonaws.com/Prod/',
  amplify_config: {
    Auth: {
      identityPoolId: 'us-west-2:d79b0895-c0df-4a45-8251-5206f369166c',
      region: 'us-west-2',
      mandatorySignIn: false
    },
    AWSPinpoint: {
      appId: '9e65b451e6ba4bcea316f62d3e50de0d',
      region: 'us-west-2',
      mandatorySignIn: false,
    }
  }
}