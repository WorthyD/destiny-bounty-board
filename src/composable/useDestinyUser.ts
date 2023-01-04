import { useAuthentication } from './useAuthentication';
import { watch, computed, ref } from 'vue';
import { api } from '@/services/api';

export function useDestinyUser() {
  const characters = ref<any[]>([]);

  function getMembershipInfo() {
    return api.getMembershipDataForCurrentUser().then((membershipInfo) => {
      if (membershipInfo.destinyMemberships.length > 0) {
        if (membershipInfo.primaryMembershipId) {
          return membershipInfo.destinyMemberships.find(
            (dm) => dm.membershipId === membershipInfo.primaryMembershipId
          );
        }
        // return default of no other found.
        return membershipInfo.Response.destinyMemberships[0];
      }
    });
  }

  function getDestinyCharacters() {
    return getMembershipInfo().then((destinyMembership) => {
      return api.destiny2GetProfile(destinyMembership).then((memberInfo) => {
        characters.value = memberInfo.profile.data.characterIds.map((cId) => {
          return memberInfo.characters.data[cId];
        });
      });
    });
  }

  return {
    getMembershipInfo,
    getDestinyCharacters,
    characters
  };
}
