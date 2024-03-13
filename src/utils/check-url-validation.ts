let protocolAndDomainRE = /^(?:\w+:)?\/\/(\S+)$/;
let localhostDomainRE = /^localhost[\:?\d]*(?:[^\:?\d]\S*)?$/
let nonLocalhostDomainRE = /^[^\s\.]+\.\S{2,}$/;

export function isUrl(string){
  if (typeof string !== 'string') {
    return false;
  }

  var match = string.match(protocolAndDomainRE);
  if (!match) {
    return false;
  }

  var everythingAfterProtocol = match[1];
  if (!everythingAfterProtocol) {
    return false;
  }

  if (localhostDomainRE.test(everythingAfterProtocol) ||
      nonLocalhostDomainRE.test(everythingAfterProtocol)) {
    return true;
  }

  return false;
}
