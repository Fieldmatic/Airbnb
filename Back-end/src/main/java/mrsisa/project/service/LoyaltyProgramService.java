package mrsisa.project.service;

import mrsisa.project.model.LoyaltyProgram;
import mrsisa.project.repository.LoyaltyProgramRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LoyaltyProgramService {

    @Autowired
    LoyaltyProgramRepository loyaltyProgramRepository;


    public LoyaltyProgram getLoyaltyProgram() {
        return loyaltyProgramRepository.findAll().get(0);
    }

    public LoyaltyProgram save(LoyaltyProgram program) {
        return loyaltyProgramRepository.save(program);
    }


}
