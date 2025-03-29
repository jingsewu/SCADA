package org.openwes.common.utils.user;

import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.AuditorAware;

import java.util.Optional;

public class AuditorAwareImpl implements AuditorAware<String> {

    @Override
    public Optional<String> getCurrentAuditor() {
        String currentUser = UserContext.getCurrentUser();
        if (StringUtils.isEmpty(currentUser)) {
            if (StringUtils.isEmpty(currentUser)) {
                return Optional.of(AuthConstants.USERNAME_SYSTEM);
            }
        }
        return Optional.of(currentUser);
    }
}
