package mrsisa.project.service;

import mrsisa.project.dto.AdventureDTO;
import mrsisa.project.model.Adventure;
import mrsisa.project.model.PriceList;
import mrsisa.project.repository.AdventureRepository;
import mrsisa.project.repository.PriceListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdventureService {

    @Autowired
    private AdventureRepository adventureRepository;

    @Autowired
    private PriceListRepository priceListRepository;

    public Adventure save(Adventure adventure) {
        return adventureRepository.save(adventure);
    }

    public void add(AdventureDTO adventureDTO) {
        Adventure adventure = this.dtoToAdventure(adventureDTO);
        adventureRepository.save(adventure);
    }

    public Adventure findOne(Long id) {
        return adventureRepository.findById(id).orElseGet(null);
    }

    public List<Adventure> findAll() {
        return adventureRepository.findAll();
    }

    public void remove(Long id) {
        adventureRepository.deleteById(id);
    }

    private Adventure dtoToAdventure(AdventureDTO dto){
        Adventure adventure = new Adventure();
        adventure.setName(dto.getAdventureName());
        adventure.setAddress(dto.getAddress());
        adventure.setPromotionalDescription(dto.getPromoDescription());
        adventure.setRules(dto.getRules());
        PriceList priceList = new PriceList();
        priceList.setHourlyRate(dto.getHourlyRate().doubleValue());
        priceList.setCancellationConditions(dto.getCancelationConditions());
        priceListRepository.save(priceList);
        priceListRepository.save(priceList);
        adventure.setPriceList(priceList);
        adventure.setRating(0.0);
        adventure.setCapacity(dto.getCapacity());
//        dodati logiku za konverotavanje stringa u listu
//        adventure.setFishingEquipment(dto.getEquipment());
        return adventure;
    }
}
