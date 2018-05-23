let uploadUrl = '';
let continueUploadUrl = '';
if (window.location.port.length > 0) {
  uploadUrl = '';
  continueUploadUrl = ''
} else {
  uploadUrl = '';
  continueUploadUrl = ''
}

const uploadKey = '';

export const uploadData = {
  url: uploadUrl,
  key: uploadKey,
  continueUrl: continueUploadUrl
}
