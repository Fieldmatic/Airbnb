package mrsisa.project.service;

import mrsisa.project.dto.CottageDTO;
import mrsisa.project.model.Cottage;
import mrsisa.project.model.PriceList;
import mrsisa.project.repository.CottageRepository;
import mrsisa.project.repository.PriceListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class CottageService {

    @Autowired
    CottageRepository cottageRepository;

    @Autowired
    PriceListRepository priceListRepository;

    public void add(CottageDTO dto) {
        Cottage cottage = dtoToCottage(dto);
        cottageRepository.save(cottage);

    }

    private Cottage dtoToCottage(CottageDTO dto) {
        Cottage cottage = new Cottage();
        cottage.setName(dto.getName());
        cottage.setAddress(dto.getAddress());
        cottage.setPromotionalDescription(dto.getPromotionalDescription());
        cottage.setRules(dto.getRules());
        PriceList priceList = new PriceList();
        priceList.setHourlyRate(dto.getHourlyRate());
        priceList.setDailyRate(dto.getDailyRate());
        priceList.setCancellationConditions(dto.getCancellationConditions());
        priceListRepository.save(priceList);
        cottage.setPriceList(priceList);
        cottage.setRating(0.0);
        return cottage;
    }

}
