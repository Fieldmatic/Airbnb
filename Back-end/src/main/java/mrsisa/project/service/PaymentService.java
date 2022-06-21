package mrsisa.project.service;

import mrsisa.project.model.Payment;
import mrsisa.project.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    @Autowired
    PaymentRepository paymentRepository;

    public double getMoneyPercentage() {
        Payment payment = paymentRepository.findAll().get(0);
        return payment.getMoneyPercentage();
    }

    public double getTotalMoney() {
        Payment payment = paymentRepository.findAll().get(0);
        return payment.getTotal();
    }

    public void increaseTotalMoney(double money) {
        Payment payment = paymentRepository.findAll().get(0);
        payment.setTotal(payment.getTotal() + money);
    }

    public void decreaseTotalMoney(double money) {
        Payment payment = paymentRepository.findAll().get(0);
        payment.setTotal(payment.getTotal() - money);
    }

    public Payment save(Payment payment) {
        return paymentRepository.save(payment);
    }

    public Payment getPaymentConfig() {
        return paymentRepository.findAll().get(0);
    }
}
